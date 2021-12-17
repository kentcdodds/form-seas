import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import teamseasTmLogo from "~/images/teamseas-tm-logo.png";
import rootStylesUrl from "~/styles/root.css";

export const meta: MetaFunction = () => {
  return {
    title: "Form Seas",
    description: "Commit yourself to donate to #TeamSeas",
  };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: rootStylesUrl },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap",
    },
  ];
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Link to="/">
          <h1>Form Seas</h1>
        </Link>
        <p>We've got to save the seas!</p>
        <a href="https://teamseas.org" target="_blank">
          <img
            id="team-seas-logo"
            src={teamseasTmLogo}
            alt="TeamSeas TM Logo"
          />
        </a>
      </header>
      {children}
    </>
  );
}
