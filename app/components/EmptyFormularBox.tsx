type EmptyFormularBoxProps = {
  onClick: () => void;
}

export const EmptyFormularBox: React.FC<EmptyFormularBoxProps> = ({ onClick }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-lg font-semibold text-gray-800">Menu jest puste</h2>
      <p className="text-sm text-gray-600 mt-2">W tym menu nie ma jeszcze żadnych linków.</p>
      <button onClick={onClick} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-300 focus:outline-none">
        + Dodaj pozycję menu
      </button>
    </div>
  );
};