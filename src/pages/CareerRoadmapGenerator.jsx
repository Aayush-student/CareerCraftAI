import React, { useState } from "react";
import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
import { Card, CardContent } from "../components/ui/card.jsx";
// import { Button } from "@/components/ui/button";
import { Button } from "../components/ui/button.jsx";
import { ChevronDown } from "lucide-react";

const ROADMAPS = {
  "Web Development": {
    steps: [
      { title: "HTML + CSS", resources: ["https://www.youtube.com/playlist?list=PLu71SKxNbfoDBNF5s-WH6aLbthSEIMhMI", "https://web.dev/learn/css/"] },
      { title: "JavaScript", resources: ["https://javascript.info/", "https://youtu.be/lGmRnu--iU8?si=TcA-NOVseFSRaIPa"] },
      { title: "Frontend Framework (React)", resources: ["https://react.dev/", "https://youtu.be/6l8RWV8D-Yo?si=Rs-2DF32L1KnlU4U"] },
      { title: "Backend (Node + Express)", resources: ["https://youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&si=8rPArYf-YYrG6BHb"] },
      { title: "Database (MongoDB / SQL)", resources: ["https://www.mongodb.com/docs/"] },
      { title: "Projects", resources: ["Build 5 full-stack projects"] }
    ]
  },

  "Backend Development": {
    steps: [
      { title: "Programming Basics (JS/Python)", resources: ["https://www.youtube.com/watch?v=PkZNo7MFNFg"] },
      { title: "APIs & Express", resources: ["https://www.youtube.com/watch?v=Oe421EPjeBE"] },
      { title: "Authentication (JWT/Session)", resources: ["https://www.youtube.com/watch?v=7Q17ubqLfaM"] },
      { title: "Databases", resources: ["https://www.mongodb.com/docs/"] },
      { title: "System Design Basics", resources: ["https://www.youtube.com/watch?v=xpz7d8vS6H0"] },
      { title: "Projects", resources: ["Build advanced REST APIs"] }
    ]
  },

  "Data Science": {
    steps: [
      { title: "Python", resources: ["https://www.youtube.com/watch?v=kqtD5dpn9C8"] },
      { title: "Maths (Stats/Linear Algebra)", resources: ["https://www.khanacademy.org/math"] },
      { title: "Pandas, NumPy", resources: ["https://www.youtube.com/watch?v=vmEHCJofslg"] },
      { title: "Data Visualization", resources: ["https://www.youtube.com/watch?v=RFKqgE0n3ds"] },
      { title: "Machine Learning", resources: ["https://www.youtube.com/watch?v=GwIo3gDZCVQ"] },
      { title: "Projects", resources: ["Build ML models"] }
    ]
  },

  "Machine Learning": {
    steps: [
      { title: "Python Essentials", resources: ["https://www.youtube.com/watch?v=kqtD5dpn9C8"] },
      { title: "ML Basics", resources: ["https://www.youtube.com/watch?v=GwIo3gDZCVQ"] },
      { title: "Deep Learning", resources: ["https://www.youtube.com/watch?v=aircAruvnKk"] },
      { title: "Neural Networks", resources: ["https://www.deeplearning.ai/"] },
      { title: "Advanced Models", resources: ["https://huggingface.co/"] },
      { title: "Projects", resources: ["Train DL models"] }
    ]
  }
};

export default function CareerRoadmapGenerator() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6"
      >
        Career Roadmap Generator
      </motion.h1>

      <Card className="w-full max-w-3xl p-4 mb-6 shadow-lg rounded-2xl bg-white">
        <p className="text-lg font-semibold mb-3">Choose Your Career Path</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(ROADMAPS).map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </Button>
          ))}
        </div>
      </Card>

      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl"
        >
          <Card className="p-5 shadow-xl rounded-2xl bg-white">
            <h2 className="text-2xl font-bold mb-4">{selectedRole} Roadmap</h2>

            <div className="space-y-4">
              {ROADMAPS[selectedRole].steps.map((step, index) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 cursor-pointer bg-gray-50"
                >
                  <summary className="flex justify-between items-center text-lg font-semibold">
                    {step.title}
                    <ChevronDown size={20} />
                  </summary>

                  <div className="mt-3 space-y-2 pl-2">
                    {step.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res}
                        target="_blank"
                        className="block text-blue-600 underline text-sm"
                      >
                        {res}
                      </a>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}