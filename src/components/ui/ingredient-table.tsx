/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IngredientDTO } from '@/api/apiSchemas';

const IngredientTable = ({ingredients, setIngredients, isEditable}:{ingredients: IngredientDTO[], setIngredients: any, isEditable: boolean}) => {
  

  const handleChange = (index: number, field: keyof IngredientDTO, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addRow = () => {
    setIngredients([...ingredients, { name: '', amount: '', measure: '' }]);
  };

  const removeRow = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Ingredient</th>
            <th className="border p-2 text-left">Amount</th>
            <th className="border p-2 text-left">Measure</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={ingredient.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="e.g. Sugar"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={ingredient.quantity}
                  onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  placeholder="e.g. 2"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={ingredient.measure}
                  onChange={(e) => handleChange(index, 'measure', e.target.value)}
                  placeholder="e.g. tbsp"
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  className="text-gray-500 hover:text-gray-700 font-medium"
                  onClick={() => removeRow(index)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-4 px-4 py-2 bg-grey-600 text-white rounded hover:bg-grey-700"
        onClick={addRow}
      >
        Add Ingredient
      </button>
    </div>
  );
}

export default IngredientTable;