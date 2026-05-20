// Mount everything.

const App = () => (
  <>
    <Hero />
    <Eligibility />
    <Tiers />
    <Timeline />
    <D21 />
    <Conduct />
    <Closing />
  </>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
