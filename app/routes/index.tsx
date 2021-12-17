import { Link, LinksFunction } from "remix";
import indexStylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: indexStylesUrl }];
};

export default function IndexRoute() {
  return (
    <div id="index-root">
      <h2>Commit yourself!</h2>
      <p>Use this app to commit yourself to donate to team seas</p>
      <Link to="/commitments" prefetch="intent">
        Commitments
      </Link>
    </div>
  );
}
