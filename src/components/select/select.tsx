import styles from "./select.module.css"

type SelectProps = {
    options: SelectOption[]
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

type SelectOption = {
    label: string
    value: string
}

export function Select({}){
  return (
    <div className={styles.container}>
        <span className={styles.value}></span>
        <button className={styles["clear-btn"]}>&times;</button>  
        <div className={styles.divider}></div>
        <div className={styles.caret}></div>
        <ul className={styles.options}>
            {}
        </ul>
    </div>
  )
}