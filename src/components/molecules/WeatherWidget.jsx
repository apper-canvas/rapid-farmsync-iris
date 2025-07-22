import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherWidget = ({ weather }) => {
  if (!weather) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">{weather.location}</p>
          <div className="flex items-baseline">
            <p className="text-4xl font-bold text-blue-900 font-display mr-2">
              {weather.temperature}°
            </p>
            <p className="text-blue-700">{weather.condition}</p>
          </div>
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Droplets" className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-700">{weather.humidity}%</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Wind" className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-700">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="bg-white/20 backdrop-blur-sm p-4 rounded-full"
        >
          <ApperIcon name={weather.icon} className="h-12 w-12 text-blue-600" />
        </motion.div>
      </div>
      
      {weather.forecast && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-blue-600 font-medium mb-1">{day.day}</p>
                <ApperIcon name={day.icon} className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-700">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeatherWidget;