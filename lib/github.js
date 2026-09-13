// Server-only helper: commits file changes straight to the repo via the
// GitHub Contents API, using a fine-grained PAT that lives only in the
// Vercel environment (GH_COMMIT_TOKEN). Never import this from client code.

const API_ROOT = "https://api.github.com";

function repoInfo() {
  const owner = process.env.GH_REPO_OWNER;
  const repo = process.env.GH_REPO_NAME;
  const branch = process.env.GH_BRANCH || "main";
  const token = process.env.GH_COMMIT_TOKEN;
  if (!owner || !repo || !token) {
    throw new Error("Missing GH_REPO_OWNER / GH_REPO_NAME / GH_COMMIT_TOKEN env vars");
  }
  return { owner, repo, branch, token };
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Returns { sha, content (utf8 string) } or null if the file doesn't exist yet.
export async function getFile(path) {
  const { owner, repo, branch, token } = repoInfo();
  const url = `${API_ROOT}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub getFile failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  const content = Buffer.from(data.content, data.encoding || "base64").toString("utf8");
  return { sha: data.sha, content };
}

// contentInput: a utf8 string, or a Buffer for binary files (e.g. images).
export async function putFile(path, contentInput, message) {
  const { owner, repo, branch, token } = repoInfo();
  const existing = await getFile(path).catch(() => null);
  const contentBase64 = Buffer.isBuffer(contentInput)
    ? contentInput.toString("base64")
    : Buffer.from(contentInput, "utf8").toString("base64");

  const url = `${API_ROOT}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch,
      sha: existing?.sha,
      committer: { name: "École des Petites Pauses — Admin", email: "admin@ecoledespetitespauses.local" },
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub putFile failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export async function putJsonFile(path, data, message) {
  return putFile(path, JSON.stringify(data, null, 2) + "\n", message);
}
