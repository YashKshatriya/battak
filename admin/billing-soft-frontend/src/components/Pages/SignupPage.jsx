import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SignupPage = () => {
  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="m-auto">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-200">Signup</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400">Password</label>
                <input
                  type="password"
                  placeholder="Create Password"
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Signup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SignupPage;