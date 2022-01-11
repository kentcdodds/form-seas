import * as React from "react";
import {
  ActionFunction,
  Form,
  json,
  LinksFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { addCommitment, getCommitments } from "~/db.server";
import commitmentsStylesUrl from "~/styles/commitments.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: commitmentsStylesUrl }];
};

type LoaderData = { commitments: Array<string> };

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    commitments: await getCommitments(),
  });
};

type ActionData = { error?: string };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const committer = formData.get("committer");
  if (typeof committer !== "string" || !committer) {
    return { error: "Committer must be provided" };
  }
  await addCommitment(committer);
  return redirect(request.url);
};

export default function CommitmentsRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  // optimistic UI code:
  const formRef = React.useRef<HTMLFormElement>(null);
  const transition = useTransition();
  let submittedCommitter;
  if (transition.submission?.action === "/commitments") {
    submittedCommitter = transition.submission.formData.get("committer");
  }
  const commitments =
    typeof submittedCommitter === "string"
      ? [submittedCommitter, ...data.commitments]
      : data.commitments;

  // reset the form after submission
  const isSubmissionValid = typeof submittedCommitter === "string";
  React.useEffect(() => {
    if (isSubmissionValid && formRef.current) {
      formRef.current.reset();
    }
  }, [isSubmissionValid]);

  return (
    <div id="commitments">
      <p>Add yourself to this list</p>
      <Form method="post" ref={formRef}>
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
      </Form>
      <hr />
      {commitments.length ? (
        <>
          <p>
            Here's everyone who's committed to clean up our oceans by donating
            to TeamSeas:
          </p>
          <ul>
            {commitments.map((commitment) => (
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
