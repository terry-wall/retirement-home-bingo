'use client'

import { useState } from 'react'

export default function LeagueCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your League</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Rank:</span>
          <span className="font-medium text-primary-600">#1</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Games:</span>
          <span className="font-medium">12</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Win Rate:</span>
          <span className="font-medium text-green-600">85%</span>
        </div>
      </div>
      <button className="w-full mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
        View League Details
      </button>
    </div>
  )
}