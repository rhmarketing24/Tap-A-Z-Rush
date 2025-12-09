// pages/index.js
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tap A→Z Rush</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ padding: 24, fontFamily: "system-ui,Segoe UI,Roboto,Arial" }}>
        <h1>Tap A→Z Rush</h1>
        <p>This is the main page placeholder. The game UI is loaded from /public/app.js</p>

        <div id="root"></div>

        {/* load the original client-side game script (if you have public/app.js) */}
        <script src="/app.js"></script>
        <link rel="stylesheet" href="/styles.css" />
      </main>
    </>
  );
}
