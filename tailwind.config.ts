const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#018765", // EL verde es el principal de lafise(extraido de la marca)
        "primary-dark": "#004D38",
        accent: "#10B981", 
        background: "#FFFFFF",
        surface: "#F3F4F6",
        text: "#1F2937",// Gris 
        "text-secondary": "#6B7280", // Gris 1/2
        border: "#E5E7EB",
        success: "#10B981",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Space Mono", "monospace"],
        "space-mono": ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
