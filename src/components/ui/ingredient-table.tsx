/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { IngredientDTO } from "@/api/apiSchemas";
import { Button } from "./button";

const IngredientTable = ({
  ingredients,
  setIngredients,
  isEditable,
}: {
  ingredients: IngredientDTO[];
  setIngredients?: any;
  isEditable: boolean;
}) => {
  const handleChange = (
    index: number,
    field: keyof IngredientDTO,
    value: string,
  ) => {
    const updated = [...ingredients];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setIngredients(updated);
  };

  const addRow = (e: any) => {
    e.preventDefault();
    setIngredients([
      ...ingredients,
      { ingredient: "", amount: "", measure: "" },
    ]);
  };

  const removeRow = (e: any, index: number) => {
    e.preventDefault();
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  if (isEditable)
    return (
      <div className="mx-auto max-w-3xl p-4">
        <h2 className="mb-4 text-center text-xl font-semibold">Ingredients</h2>
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
                    className="w-full rounded border px-2 py-1"
                    value={ingredient.ingredient}
                    onChange={(e) =>
                      handleChange(index, "ingredient", e.target.value)
                    }
                    placeholder="e.g. Sugar"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full rounded border px-2 py-1"
                    value={ingredient.amount}
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.value)
                    }
                    placeholder="e.g. 2"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full rounded border px-2 py-1"
                    value={ingredient.measure}
                    onChange={(e) =>
                      handleChange(index, "measure", e.target.value)
                    }
                    placeholder="e.g. tbsp"
                  />
                </td>
                <td className="border p-2 text-center">
                  <Button onClick={(e) => removeRow(e, index)}>✕</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button onClick={(e) => addRow(e)}>Add Ingredient</Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h2 className="mb-4 text-center text-xl font-semibold">Ingredients</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Ingredient</th>
            <th className="border p-2 text-left">Amount</th>
            <th className="border p-2 text-left">Measure</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={`ingredient-${index}`}>
              <td className="border p-2">
                <div className="w-full rounded border px-2 py-1">
                  {ingredient.ingredient}
                </div>
              </td>
              <td className="border p-2">
                <div className="w-full rounded border px-2 py-1">
                  {ingredient.amount}
                </div>
              </td>
              <td className="border p-2">
                <div className="w-full rounded border px-2 py-1">
                  {ingredient.measure}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientTable;
