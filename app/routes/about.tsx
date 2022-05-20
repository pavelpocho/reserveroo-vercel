import { Link, useLoaderData } from "@remix-run/react";
// import { LinkWithLoader } from "~/components/LinkWithLoader";

export default function About() {
  return (
    <div>
      <h1>
        Welcome to the best place in the world.
      </h1>
      <Link to={'/'} >See place list.</Link>
    </div>
  );
}