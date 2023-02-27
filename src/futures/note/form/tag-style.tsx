
export const style = {
  control: (base: any) => ({
      ...base,
      boxShadow: "none", 
      width: 300,
      borderColor: "#a3c639",
      borderRadius:0,
      backgroundColor: "#c6a3390",
      "&:hover": {
          borderColor: "#a3c639"
      },
      singleValue: (provided: any, state: { data: { color: any; }; selectProps: { myFontSize: any; }; }) => ({
        ...provided,
        color: state.data.color,
        fontSize: state.selectProps.myFontSize
      }),
      multiValue: (styles: any) => ({
        ...styles,
        backgroundColor: "red",
        borderRadius: "50%",
    }),
  }),
  option: (base: any, state: any) => ({
    ...base,
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

