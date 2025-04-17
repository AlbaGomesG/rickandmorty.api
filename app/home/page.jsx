"use client";
import { useEffect, useState } from "react";
import CharacterCard from "../../components/CharacterCard";
import axios from "axios";
import styles from "./Home.module.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

export default function Home() {
    const [search, setSearch] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [characters, setCharacters] = useState([]);

   
        const fetchCharacters = async(name = "") => {
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`);
                setCharacters(data.results);
            } catch (error) {
                console.log('Erro ao buscar o personagem:', error);
                setNotFound(true);
                setCharacters([]);
            }
        };
        
        useEffect(() => {
        fetchCharacters();
    }, []);

    const handleCardClick = (name) => {
        toast.info(`Você clicou em ${name}`, {
        });
    };

    const buttonResetClick = (message) => {
        toast.info(message, {
        });
    };

    console.log(characters);


    return(
        <div className={styles.container}>
            <ToastContainer
            position="top-right" autoClose={7500} theme="dark"
            />
            <h1 className={styles.titleContainer}>Rick and Mory👽</h1>
            <div className={styles.controls}>
            <input className={styles.input}type="text" placeholder="Procure Aqui!" value={search} onChange={(e) => setSearch(e.target.value)}/>

            <button className={styles.buttonSearch}
            onClick={() => fetchCharacters(search.trim())}
            >Buscar</button>

            <button className={styles.buttonReset} onClick={() => {
                setSearch("");
                fetchCharacters();
                buttonResetClick("Você resetou os personagens!");
            }}>Resatar</button>
            </div>

            {notFound && (
                <h1 className={styles.notFound}>Nenhum personagem encontrado😫</h1>
            )}
            <div className={styles.grid}>
                {characters.map((char) => (
                <CharacterCard key={char.id} character={char} onClick={() =>
                    handleCardClick(char.name)}
                />
            ))}
            </div>
        </div>
    );
}