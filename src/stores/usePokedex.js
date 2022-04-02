import create from "zustand";

const usePokedex = create((set) => ({
  pokedex: [],
  setPokedex: (pokedex) => set({ pokedex }),
}));

export default usePokedex;

// const usePokedex = create(
//   persist(
//     (set, get) => ({
//       pokedex: [],
//       setPokedex: (pokedex) => set({ pokedex }),
//     }),
//     {
//       name: "pokedex",
//       // getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
//     }
//   )
// );

// export default usePokedex;
