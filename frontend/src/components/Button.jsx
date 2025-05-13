import styles from "../static/button.module.css"

function Button({text, func, isHollow, fontSize}) {
	return (
		<button style={{fontSize: fontSize}} onClick={func} className={(isHollow ? styles.hollowBtn : "")}>{text}</button>
	)
}

export default Button;