import styles from "../styles/CharacterCard.module.css";

export default function CharacterCard( {character} ) {
    return(
        <div className={styles.card}>
            <div className={styles.containerImage}>
            <img className={styles.avatar}  src={character.image} />
            </div>
            <div className={styles.containerTexts}>
            <h3 className={styles.title}>{character.name}</h3>
            <p className={styles.text}>{character.gender}</p>
            <p className={styles.text}>{character.species}</p>
            <p className={styles.text}>{character.status}</p>
            </div>
        </div>
    );
}