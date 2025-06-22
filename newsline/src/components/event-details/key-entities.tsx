import React from "react";
import { KeyEntity } from "@/types/report";

interface KeyEntitiesProps {
  entities: KeyEntity[];
}

const EntityTag = ({ name, type, role }: { name: string; type: string; role: string }) => {
  const getTypeColor = () => {
    switch (type.toLowerCase()) {
      case "person":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "organization":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "cryptocurrency":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "project":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="flex flex-col rounded-md border border-gray-200 p-2 dark:border-gray-800">
      <div className="font-medium">{name}</div>
      <div className="mt-1 flex items-center gap-1">
        <span className={`rounded px-1.5 py-0.5 text-xs ${getTypeColor()}`}>{type}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{role}</span>
      </div>
    </div>
  );
};

export function KeyEntities({ entities }: KeyEntitiesProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {entities.map((entity, index) => (
        <EntityTag
          key={`entity-${index}`}
          name={entity.name}
          type={entity.type}
          role={entity.role}
        />
      ))}
    </div>
  );
}
