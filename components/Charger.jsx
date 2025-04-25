import Image from "next/image";
import styles from "../styles/Charger.module.css";

export default function Charger() {
    return (
        <div className={styles.container}>
            <Image src="/charger.gif" alt="Carregando..." width={300} height={300} priority className={styles.image}/>
            <h1 className={styles.message}>Carregando ...</h1>
        </div>
    )
}