"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  rectIntersection,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core";
import { AddMenuItemForm, EmptyFormularBox, MenuRow } from "./components";
import { HoverPosition, MenuItem } from "./types";
import {
  calculateLinePosition,
  findIndexAndEdit,
  findIndexAndAddItem,
  findMenuItemById,
  removeAndExtractItem,
} from "./utils";
import { MockItems } from "./mocks";

export default function Home() {
  const [menuItems, setMenuItems] = useState<Array<MenuItem>>(MockItems);
  const [showFormular, setShowFormular] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition | null>(
    null
  );

  const activeItem = activeId ? findMenuItemById(activeId, menuItems) : null;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);

    if (!over || active.id === over.id) return;

    setMenuItems((prev) => {
      const { removedItem, updatedItems } = removeAndExtractItem(
        prev,
        active.id as string
      );

      if (!removedItem) return prev;

      const addedAndMovedItem = findIndexAndAddItem(
        updatedItems,
        removedItem,
        over.id as string,
        hoverPosition as HoverPosition
      );

      return addedAndMovedItem;
    });
  };

  const handleOnDragMove = (item: DragMoveEvent) => {
    if (!item.over || !item.active.rect.current.initial || !item.over.rect)
      return;

    const linePosition = calculateLinePosition(item);

    setHoverPosition(linePosition);
  };

  return (
    <div className="border rounded m-2">
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleOnDragMove}
      >
        <div className="flex flex-col w-full items-start relative">
          {menuItems.map((item) => (
            <MenuRow
              key={item.id}
              item={item}
              level={0}
              activeId={activeId}
              hoverPosition={hoverPosition}
              onDelete={(id) => {
                const { updatedItems } = removeAndExtractItem(menuItems, id);

                setMenuItems(updatedItems);
              }}
              onAddNewItem={(item, id) => {
                const updatedItems = findIndexAndAddItem(
                  menuItems,
                  item,
                  id,
                  HoverPosition.Bottom
                );

                setMenuItems(updatedItems);
              }}
              onEditItem={(item, id) => {
                const updatedItems = findIndexAndEdit(menuItems, item, id);

                setMenuItems(updatedItems);
              }}
            />
          ))}
        </div>
        <DragOverlay>
          {activeItem && (
            <div className="bg-white border border-gray-200 shadow-lg p-4">
              <p className="font-semibold text-gray-800">{activeItem.name}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
      {showFormular && (
        <div className="p-6">
          <AddMenuItemForm
            onSubmitForm={(data) => {
              setMenuItems((prev) => [...prev, data]);

              setShowFormular(false);
            }}
            onDelete={() => {}}
            onCancel={() => {
              console.log("onCancel");
              setShowFormular(false);
            }}
          />
        </div>
      )}
      {menuItems.length === 0 && (
        <div className="p-6">
          <EmptyFormularBox onClick={() => setShowFormular(true)} />
        </div>
      )}
      {menuItems.length > 0 && (
        <div className="p-6">
          <button
            onClick={() => setShowFormular(true)}
            className="p-6 py-2 bg-white text-gray-800 font-medium border border-gray-200 rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Dodaj pozycję menu
          </button>
        </div>
      )}
    </div>
  );
}
