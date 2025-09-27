import MainPage from "./components/MainPage";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Main content container with padding to avoid navbar overlap */}
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <MainPage />
        </div>
      </main>
    </div>
  );
}