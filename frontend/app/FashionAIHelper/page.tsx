// app/FashionAIHelper/page.tsx

import FashionAIHelper from './FashionAIHelper'; // Import the main content component
import AnimatedBackground from './AnimatedBackground'; // Import the background animation component

const Page = () => {
  return (
    <div className="relative">
      {/* Render Animated Background */}
      <AnimatedBackground />
      {/* Render Fashion AI Helper content */}
      <FashionAIHelper />
    </div>
  );
};

export default Page;
