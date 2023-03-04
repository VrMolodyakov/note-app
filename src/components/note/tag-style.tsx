
export const style = {
  control: (base: any, state: { isFocused: any; }) => ({
    ...base,
    background: "#fff0",
    // match with the menu
    // Overwrittes the different states of border
    borderColor: "green",
    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "red" : "blue"
    }
  }),
  option: (styles: any, {isFocused, isSelected}: any) => ({
    ...styles,
    background: isFocused
        ? 'rgba(22, 192, 79, 0.596)'
        : isSelected
            ? 'rgba(22, 192, 79, 0.596)'
            : undefined,
    backgroundColor : "#fff0",

  }),
  menu: (base: any) => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    // kill the gap
    marginTop: 0,
    backgroundColor : "#fff0",
  }),
  menuList: (base: any) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1"
    },
    "::-webkit-scrollbar-thumb": {
      background: "#888"
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555"
    }
  })
};

















// export const style = {
//     control: (base: any) => ({
//         ...base,
//         boxShadow: "none", 
//         width: 300,
//         borderColor: "#a3c639",
//         borderRadius:0,
//         backgroundColor: "#c6a3390",
//         "&:hover": {
//             borderColor: "#a3c639"
//         },
//         singleValue: (provided: any, state: { data: { color: any; }; selectProps: { myFontSize: any; }; }) => ({
//           ...provided,
//           color: state.data.color,
//           fontSize: state.selectProps.myFontSize
//         })
//     })
// };


// export const style = {
//   control: (styles: any) => ({ ...styles, backgroundColor: 'white' }),
//   option: (styles: { [x: string]: any; }, { data, isDisabled, isFocused, isSelected }: any) => {
//     return {
//       ...styles,
//       backgroundColor: isDisabled
//         ? null
//         : isSelected
//         ? data.color
//         : isFocused
//         ? 'red'
//         : null,
//       color: isDisabled
//         ? '#ccc'
//         : isSelected
//         ? 'white'
//           ? 'white'
//           : 'black'
//         : data.color,
//       cursor: isDisabled ? 'not-allowed' : 'default',

//       ':active': {
//         ...styles[':active'],
//         backgroundColor:
//           !isDisabled && (isSelected ? data.color : 'green'),
//       },
//     };
//   }
// };  


// export const sstyle = {
//     option: (defaultStyles: any, state: { isSelected: any; }) => ({
//       ...defaultStyles,
//       color: state.isSelected ? "orange" : "green",
//       backgroundColor: state.isSelected ? "purple" : "yellow",
//     }),

//     control: (defaultStyles: any) => ({
//       ...defaultStyles,
//       backgroundColor: "red",
//       border: "none",
//       boxShadow: "none",
//     }),
//     singleValue: (base: any) => ({
//         ...base,
//         padding: "5px 10px",
//         borderRadius: 5,
//         background: "blue",
//         color: "white",
//         display: "flex",
//         width: "fit-content",
//       }),
//   };

