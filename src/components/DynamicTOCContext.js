import { createContext, useContext, useState, useCallback } from 'react';

const DynamicTOCContext = createContext({
  tocItems: [],
  setTocItems: () => {},
});

export function DynamicTOCProvider({ children }) {
  const [tocItems, setTocItemsState] = useState([]);
  const setTocItems = useCallback((items) => {
    setTocItemsState(items);
  }, []);

  return (
    <DynamicTOCContext.Provider value={{ tocItems, setTocItems }}>
      {children}
    </DynamicTOCContext.Provider>
  );
}

export function useDynamicTOC() {
  return useContext(DynamicTOCContext);
}
