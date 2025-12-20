const config = {
  plugins: [
    "@tailwindcss/postcss",
    [
      "autoprefixer",
      {
        // Add vendor prefixes automatically for better browser support
        flexbox: "no-2009",
        grid: "autoplace",
      },
    ],
  ],
};

export default config;
