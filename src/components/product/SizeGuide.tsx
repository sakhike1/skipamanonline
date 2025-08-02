import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ isOpen, onClose }) => {
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');

  const sizeChart = {
    men: {
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      chest: [32, 34, 36, 38, 40, 42],
      waist: [26, 28, 30, 32, 34, 36],
      length: [26, 27, 28, 29, 30, 31],
    },
    women: {
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      chest: [30, 32, 34, 36, 38, 40],
      waist: [24, 26, 28, 30, 32, 34],
      length: [24, 25, 26, 27, 28, 29],
    }
  };

  const currentChart = sizeChart[selectedGender];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Ruler className="text-gray-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Gender Toggle */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedGender('men')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedGender === 'men'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => setSelectedGender('women')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedGender === 'women'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Women
            </button>
          </div>

          {/* Size Chart */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Size
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                    Chest (inches)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                    Waist (inches)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                    Length (inches)
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentChart.sizes.map((size, index) => (
                  <tr key={size} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                      {size}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                      {currentChart.chest[index]}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                      {currentChart.waist[index]}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                      {currentChart.length[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Chest</h4>
                    <p className="text-sm text-gray-600">
                      Measure around the fullest part of your chest, keeping the tape horizontal.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Waist</h4>
                    <p className="text-sm text-gray-600">
                      Measure around your natural waistline, keeping the tape comfortably loose.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Length</h4>
                    <p className="text-sm text-gray-600">
                      Measure from the shoulder to the desired length of the garment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Tips</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Our Fit</h4>
                  <p className="text-sm text-blue-800">
                    Our t-shirts have a relaxed, comfortable fit. If you prefer a tighter fit, consider sizing down.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Fabric</h4>
                  <p className="text-sm text-green-800">
                    Made from 100% organic cotton that may shrink slightly after the first wash.
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Still Unsure?</h4>
                  <p className="text-sm text-yellow-800">
                    Contact our customer service team for personalized size recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Chart */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">International Size Conversion</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                      US
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                      UK
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                      EU
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                      AU
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">S</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">S</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">S</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">S</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">M</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">M</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">M</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">M</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">L</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">L</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">L</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">L</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">XL</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">XL</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">XL</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">XL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide; 