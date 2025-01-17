import { useEffect, useState } from "react";
import { Card } from "./ui/card";

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 16,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds >= 0) return { ...prev, seconds: newSeconds };
        
        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) return { ...prev, minutes: newMinutes, seconds: 59 };
        
        const newHours = prev.hours - 1;
        if (newHours >= 0) return { hours: newHours, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="p-4 bg-red-50 border-sale">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sale">Flash Sales</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Left:</span>
          <div className="flex items-center space-x-1">
            <span className="bg-sale text-white px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-sale text-white px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-sale text-white px-2 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FlashSales;