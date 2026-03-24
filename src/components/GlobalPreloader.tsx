const GlobalPreloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden preloader-bg flex items-center justify-center">
      <div className="preloader-scene" aria-label="Loading website">
        <div className="preloader-orbit preloader-orbit-1" />
        <div className="preloader-orbit preloader-orbit-2" />
        <div className="preloader-orbit preloader-orbit-3" />
        <div className="preloader-core" />
      </div>
      <p className="preloader-text">Preparing your learning journey...</p>
    </div>
  );
};

export default GlobalPreloader;