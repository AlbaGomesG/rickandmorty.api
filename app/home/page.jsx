"use client";

import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import styles from "./Home.module.css";
import "react-toastify/dist/ReactToastify.css";
import CharacterCard from "../../components/CharacterCard";
import Charger from "../../components/Charger"; 

export default function Home() {
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const cacheRef = useRef(new Map());

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        const cleanCacheIfNeeded = () => {
            while (cache.size >= 5) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
                console.log(`Removido do cache: ${firstKey}`);
            }
        };

        console.log("Busca iniciada...");
        console.log(`Cache anterior: ${cache.size} páginas`);

        let total = totalPages;

        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            setCharacters(cached.results);
            setTotalPages(cached.totalPages);
            total = cached.totalPages;
            setLoading(false);
            setNotFound(false);
            console.log(`Usando cache: ${cacheKey}`);
        } else {
            try {
                const { data } = await axios.get(
                    `https://rickandmortyapi.com/api/character/?name=${name}&page=${pageNumber}`
                );

                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                });

                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
                console.log(`Salvo no cache: ${cacheKey}`);
            } catch {
                setCharacters([]);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }

        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(`https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
                console.log(`Prefetch Salvo: ${nextCacheKey}`);
            } catch (error){
                console.log(`Prefetch Falhou: ${nextCacheKey}`, error);
            }

            console.log(`Cache atual: ${cache.size} páginas`);
            for (const [key, value] of cache.entries()) {
                console.log(`${key}: ${value.results.length} personagens`);
            }
            console.log("Busca concluída.");
        };
    }

    useEffect(() => {
        fetchCharacters();
    }, []);


    const [search, setSearch] = useState("");   
        const handleSearch = () => {
            setPage(1);
            fetchCharacters(search, 1);
        };

        const handleReset = () => {
            setSearch("");
            setPage(1);
            fetchCharacters("", 1);
            toast.success("Busca resetada!", {position: "top-right"});
        };

        const handleCardClick = (char) => {
            toast.info(`Você clicou em ${char.name} que está ${char.status}`)
        };

        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);

        useEffect(() => {
            fetchCharacters(search, page);
        }, [search, page]);

    return (
        <div className={styles.container}>
            <ToastContainer 
            position="top-right"
            autoClose={7500}
            theme="dark"
            />
            <h1 className={styles.titleContainer}>Rick an Morty👽</h1>
            <div className={styles.controls}>
                <input className={styles.input}type="text" placeholder="Procure Aqui!" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button className={styles.buttonSearch} onClick={handleSearch}>Buscar</button>
                <button className={styles.buttonReset} onClick={handleReset}>Resetar</button>
            </div>

            <div className={styles.navControls}>
                <button className={styles.buttonNav} onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || notFound}>
                    Página Anterior
                </button>

                <span className={styles.pageNumber} >
                    Página {page} de {totalPages}
                </span>

                <button className={styles.buttonNav} onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages || notFound}>
                    Próxima Página
                </button>
            </div>

            {notFound && <h1 className={styles.notFound}>Nenhum personagem encontrado!😫</h1>}
            
            {loading ? (
                <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                    <Charger />
                </div>
            ) : (
                <div className={styles.grid}>
                    {characters.map((char) => (
                        <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char)} />
                    ))}
                </div>
            )}
            
        </div>
    );
}
