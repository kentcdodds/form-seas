import * as React from "react";
import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useTransition,
} from "remix";
import { addCommitment, getCommitments } from "~/db.server";
import commitmentsStylesUrl from "~/styles/commitments.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: commitmentsStylesUrl }];
};

type LoaderData = { commitments: Array<string> };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    commitments: await getCommitments(),
  };
  return json(data);
};
type ActionData = { error?: string };

export const action: ActionFunction = async ({ request }) => {
  const { committer } = await request.json();
  if (typeof committer !== "string" || !committer) {
    return { error: "Committer must be provided" };
  }
  await addCommitment(committer);
  return redirect(request.url);
};

export default function CommitmentsRoute() {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const committer = form.committer.value;
    if (typeof committer !== "string" || !committer) {
      return;
    }
    const searchParams = new URLSearchParams([
      ["data", "routes/client-only/commitments"],
    ]);
    fetch(`/client-only/commitments?${searchParams.toString()}`, {
      method: "POST",
      body: JSON.stringify({ committer }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      navigate(".", { replace: true });
      form.committer.value = "";
    });
  }

  return (
    <div id="commitments">
      <p>Add yourself to this list</p>
      <form onSubmit={handleSubmit}>
        <div className="committer-form-group">
          <label htmlFor="committer">Your name</label>
          <input id="committer" type="text" name="committer" />
          <button type="submit">Commit</button>
        </div>
        {actionData?.error ? (
          <div id="committer-error" className="error-message">
            {actionData.error}
          </div>
        ) : null}
      </form>
      <hr />
      {data.commitments.length ? (
        <>
          <p>
            Here's everyone who's committed to clean up our oceans by donating
            to TeamSeas:
          </p>
          <ul>
            {data.commitments.map((commitment) => (
              <li key={commitment}>
                <div>{commitment}</div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No one has committed to clean up the seas yet!</p>
      )}
    </div>
  );
}
