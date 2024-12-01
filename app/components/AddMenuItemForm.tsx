"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { FormValues, MenuItem } from "../types";
import { v4 as uuidv4 } from "uuid";

type AddMenuItemFormProps = {
  onSubmitForm: (data: MenuItem) => void;
  onCancel: () => void;
  onDelete: () => void;
  editedItem?: MenuItem;
};

export const AddMenuItemForm: React.FunctionComponent<AddMenuItemFormProps> = ({
  onSubmitForm,
  onCancel,
  onDelete,
  editedItem,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (editedItem) {
      setValue("name", editedItem.name);
      setValue("link", editedItem.link);

      return;
    }

    setValue("name", "");
    setValue("link", "");
  }, [editedItem]);

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmitForm({
          ...data,
          id: uuidv4(),
        })
      )}
      className="bg-white p-6 rounded-lg shadow-md w-full border border-gray-300 relative"
    >
      {editedItem && (
        <button
          type="button"
          className="absolute right-4 top-6 flex px-3 items-center text-red-500 hover:text-red-700 transition"
          onClick={() => onDelete()}
        >
          <AiOutlineDelete className="mr-2" />
        </button>
      )}

      <div className="mb-4 pr-16">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nazwa
        </label>
        <input
          id="name"
          type="text"
          placeholder="np. Promocje"
          {...register("name", { required: "Nazwa jest wymagana" })}
          className={`mt-1 text-black px-3 block w-full py-2 rounded-md border border-solid border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4 pr-16">
        <label
          htmlFor="link"
          className="block text-sm font-medium text-gray-700"
        >
          Link
        </label>
        <div className="relative">
          <input
            id="link"
            type="text"
            placeholder="Wklej lub wyszukaj"
            {...register("link", {})}
            className={`mt-1 text-black px-3 py-2 block border border-solid w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 ${
              errors.link ? "border-red-500" : ""
            }`}
          />
          <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        {errors.link && (
          <p className="text-sm text-red-500 mt-1">{errors.link.message}</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <button
            type="button"
            className="mr-4 py-2 px-4 rounded border-solid border-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            onClick={onCancel}
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="py-2 px-4 rounded bg-purple-500 text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-300 transition"
          >
            {editedItem ? "Edytuj" : "Dodaj"}
          </button>
        </div>
      </div>
    </form>
  );
};
