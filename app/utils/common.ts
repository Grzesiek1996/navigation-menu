import { DragMoveEvent, UniqueIdentifier } from "@dnd-kit/core";
import { HoverPosition, MenuItem } from "../types";

export const removeAndExtractItem = (
  items: MenuItem[],
  id: string
): { updatedItems: MenuItem[]; removedItem: MenuItem | null } => {
  let removedItem: MenuItem | null = null;

  const updatedItems = items.reduce((result, item) => {
    if (item.id === id) {
      removedItem = item;
      return result;
    }

    const updatedChildren = item.children
      ? removeAndExtractItem(item.children, id)
      : null;

    if (updatedChildren?.removedItem) {
      removedItem = updatedChildren.removedItem;
    }

    return [
      ...result,
      {
        ...item,
        children: updatedChildren
          ? updatedChildren.updatedItems
          : item.children,
      },
    ];
  }, [] as MenuItem[]);

  return { updatedItems, removedItem };
};

export const findIndexAndAddItem = (
  menuItems: Array<MenuItem>,
  menuItem: MenuItem,
  id: string,
  position: HoverPosition
): Array<MenuItem> => {
  return menuItems.reduce<Array<MenuItem>>((result, item) => {
    if (position === HoverPosition.Top && item.id === id) {
      return [...result, menuItem, item];
    }

    if (position === HoverPosition.Bottom && item.id === id) {
      return [...result, item, menuItem];
    }

    if (position === HoverPosition.BottomChildren && item.id === id) {
      return [
        ...result,
        {
          ...item,
          children: item.children ? [menuItem, ...item.children] : [menuItem],
        },
      ];
    }

    const updatedChildren = item.children
      ? findIndexAndAddItem(item.children, menuItem, id, position)
      : undefined;

    return [
      ...result,
      {
        ...item,
        children: updatedChildren,
      },
    ];
  }, []);
};

export const calculateLinePosition = ({
  over,
  delta,
  active,
}: DragMoveEvent) => {
  if (!over || !active.rect.current.initial || !over.rect) return null;

  const currentCenter =
    active.rect.current.initial.top +
    active.rect.current.initial.height / 2 +
    delta.y;

  //fix calculation for rows with rows with children
  const constHeight = 62;

  const overTop = over.rect.top;

  const overMiddle = overTop + constHeight / 2;
  const overBottom = overTop + constHeight;

  const isBottomLine =
    currentCenter >= overMiddle && currentCenter <= overBottom;
  const isChildren =
    delta.x + active.rect.current.initial.left > over.rect.left + 30;

  if (currentCenter <= overMiddle && currentCenter >= overTop) {
    return HoverPosition.Top;
  }

  if (isBottomLine && isChildren) {
    return HoverPosition.BottomChildren;
  }

  return HoverPosition.Bottom;
};

export const findMenuItemById = (
  id: UniqueIdentifier,
  items: MenuItem[]
): MenuItem | undefined => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findMenuItemById(id, item.children);
      if (found) return found;
    }
  }
  return undefined;
};

export const findIndexAndEdit = (
  menuItems: MenuItem[],
  menuItem: MenuItem,
  id: string
): MenuItem[] => {
  return menuItems.map((item) => {
    if (item.id === id) {
      return { ...menuItem, children: item.children };
    }

    const updatedChildren = item.children
      ? findIndexAndEdit(item.children, menuItem, id)
      : item.children;

    return {
      ...item,
      children: updatedChildren,
    };
  });
};
