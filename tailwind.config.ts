    import type { Config } from "tailwindcss";

    const config: Config = {
      content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        container: {
          center: true,
          padding: "2rem",
          screens: {
            "2xl": "1400px",
          },
        },
        extend: {
          colors: {
            bg: "hsl(var(--bg))",
            text: "hsl(var(--text))",
            accent: "hsl(var(--accent))",
            primary: "hsl(var(--primary))",
            surface: "hsl(var(--surface))",
            "secondary-text": "hsl(var(--secondary-text))",
          },
          borderRadius: {
            lg: "var(--radius-lg)",
            md: "var(--radius-md)",
            sm: "var(--radius-sm)",
            xl: "var(--radius-xl)",
          },
          boxShadow: {
            md: "var(--shadow-md)",
            sm: "var(--shadow-sm)",
          },
          spacing: {
            lg: "var(--spacing-lg)",
            md: "var(--spacing-md)",
            sm: "var(--spacing-sm)",
            xl: "var(--spacing-xl)",
            xs: "var(--spacing-xs)",
          },
          fontSize: {
            body: ["1rem", { lineHeight: "1.75rem", fontWeight: "400" }],
            caption: ["0.875rem", { lineHeight: "1", fontWeight: "400" }],
            display: ["1.5rem", { fontWeight: "700" }],
            heading: ["1.25rem", { fontWeight: "600" }],
          },
          animation: {
            "ease-in-out": "ease-in-out",
          },
          keyframes: {
            // Add if needed for motion
          },
        },
      },
      plugins: [require("tailwindcss-animate")],
    };
    export default config;
  