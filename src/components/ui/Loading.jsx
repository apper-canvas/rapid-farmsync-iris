import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="p-6 space-y-6">
        {/* Weather Widget Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm shimmer">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm shimmer">
              <div className="h-8 w-8 bg-gray-200 rounded-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>

        {/* Tasks Summary Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4 shimmer">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm shimmer">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded ml-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm shimmer">
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;