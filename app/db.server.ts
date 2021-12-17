import fs from "fs/promises";

const commitmentsFilePath = "./commitments.json";

export async function getCommitments() {
  const commitments = JSON.parse(
    await fs.readFile(commitmentsFilePath, "utf8")
  );
  if (
    !Array.isArray(commitments) ||
    commitments.some((c) => typeof c !== "string")
  ) {
    throw new Error("Commitments data is incorrect");
  }
  return commitments as Array<string>;
}

export async function addCommitment(committer: string) {
  const commitments = await getCommitments();
  await fs.writeFile(
    commitmentsFilePath,
    JSON.stringify([committer, ...commitments])
  );
}
