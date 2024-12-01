"use client";

import React, { useState } from "react";
import { UniqueIdentifier, useDraggable, useDroppable } from "@dnd-kit/core";
import { HoverPosition, MenuItem } from "../types";
import { AddMenuItemForm } from "./AddMenuItemForm";

type MenuRowProps = {
  item: MenuItem;
  level: number;
  activeId: UniqueIdentifier | null;
  hoverPosition: HoverPosition | null;
  onDelete: (id: string) => void;
  onAddNewItem: (item: MenuItem, id: string) => void;
  onEditItem: (item: MenuItem, id: string) => void;
};

export const MenuRow: React.FC<MenuRowProps> = ({
  item,
  level,
  activeId,
  hoverPosition,
  onDelete,
  onAddNewItem,
  onEditItem,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
  } = useDraggable({
    id: item.id,
  });
  const [addItem, setAdditem] = useState(false);
  const [editedItem, setEditedItem] = useState<MenuItem>();

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: item.id,
  });

  const isDragging = item.id === activeId;
  const showBlueLine = isOver && !isDragging;
  const hasChildren = Boolean(item.children);

  return (
    <div
      ref={(node) => {
        setDraggableRef(node);
        setDroppableRef(node);
      }}
      className={`relative pl-${level * 4} w-full bg-gray-50 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        className={`flex w-full items-center justify-between py-2 px-4 border border-gray-200 bg-white relative
              }
        `}
      >
        <div className="flex items-center gap-2">
          <span
            {...listeners}
            {...attributes}
            className="cursor-move text-gray-400"
          >
            ↕
          </span>
          <div>
            <p className="font-semibold text-gray-800 whitespace-nowrap">
              {item.name}
            </p>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {item.link}
            </p>
          </div>
        </div>

        <div className="flex divide-x divide-gray-300 border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onDelete(item.id)}
            className="px-4 py-2 text-gray-800 hover:bg-gray-100  transition whitespace-nowrap"
          >
            Usuń
          </button>
          <button
            onClick={() => setEditedItem(item)}
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 transition whitespace-nowrap	"
          >
            Edytuj
          </button>
          <button
            onClick={() => {
              setAdditem(true);
              setEditedItem(undefined);
            }}
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 transition whitespace-nowrap	"
          >
            Dodaj pozycję menu
          </button>
        </div>

        {showBlueLine && (
          <div
            className={`absolute left-0 flex items-center w-full z-10 h-[2px] ${
              hoverPosition === HoverPosition.Top
                ? "top-0"
                : hoverPosition === HoverPosition.BottomChildren
                ? "bottom-0 left-4"
                : "bottom-0"
            }`}
          >
            <div className="w-2 h-2 bg-white border border-blue-500 rounded-full"></div>
            <div className="h-[2px] bg-blue-500 flex-1"></div>
          </div>
        )}
      </div>
      {!isDragging && item.children && (
        <div className="pl-4">
          {item.children.map((child) => (
            <MenuRow
              key={child.id}
              item={child}
              level={level + 1}
              activeId={activeId}
              hoverPosition={hoverPosition}
              onDelete={onDelete}
              onAddNewItem={onAddNewItem}
              onEditItem={onEditItem}
            />
          ))}
        </div>
      )}

      {(addItem || editedItem) && (
        <div className="py-4 px-6">
          <AddMenuItemForm
            onSubmitForm={(menuItem) => {
              if (editedItem) {
                setEditedItem(undefined);
                onEditItem(menuItem, item.id);

                return;
              }

              setAdditem(false);
              onAddNewItem(menuItem, item.id);
            }}
            onCancel={() => {
              setAdditem(false);
              setEditedItem(undefined);
            }}
            onDelete={() => {
              console.log("onDelete");

              setAdditem(false);
              onDelete(item.id);
            }}
            editedItem={editedItem}
          />
        </div>
      )}
    </div>
  );
};

{
  /* <div className="py-4 px-6">
<AddMenuItemForm onSubmitForm={() => {}} onCancel={() => {}} />
</div>  */
}
