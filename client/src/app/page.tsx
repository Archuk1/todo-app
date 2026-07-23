// This route is always intercepted by middleware.ts before it renders
// (redirects to /tasks or /login depending on the auth cookie), so this
// component is just a safety-net fallback.
export default function Home() {
  return null;
}
