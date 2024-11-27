import { createQuery } from "@tanstack/solid-query";
import type { MovieDetails } from "./types";
import { createMemo, createSignal, For, Suspense } from "solid-js";
import { navigate } from "vike/client/router";
import { Config } from "vike-solid/Config";
import { Head } from "vike-solid/Head";
import { isServer } from "solid-js/web";

export function Movies() {
    const [isEnabled, setIsEnabled] = createSignal(false);

    const query = createQuery(() => ({
        queryKey: [
            "movies",
            // isEnabled() // actually cool would be also if this would work.
            // The use case is dependent queries, when you eg.
            // have a endpoint that returns the user_id and you want to get the current user, you propably want to wait for the user_id to be loaded.
            // so you get at first a query with ["user", null] which will be always disabled,
            // and then you get the user_id you know the new query_key ["user",
            // user_id] which will be always enabled.
            // Because we changed the query_key now the query with ["user",
            // null] doesn't have any subscribers.
            // This fact could be useful for implementation
        ],
        queryFn: getStarWarsMovies,
        enabled: isEnabled()
    }));

    setIsEnabled(true)

    const memoQuery = createMemo(() => query.data);

    const onNavigate = (id: string) => {
        navigate(`/${id}`);
    };

    return (
        <Suspense>
            <>
                <Config title={`${memoQuery()?.length} Star Wars movies`}/>
                <Head>
                    <meta name="description" content={`List of ${memoQuery()?.length} Star Wars movies.`}/>
                </Head>
                <h1>Star Wars Movies</h1>
                <a href={memoQuery()?.length ?? 0 > 0 ? `/more` : "/less"}>Star Wars movies</a>
                <ol>
                    <For each={memoQuery()}>
                        {(movie) => (
                            <li>
                                <button onClick={() => onNavigate(movie.id)}>{movie.title}</button>
                                ({movie.release_date})
                            </li>
                        )}
                    </For>
                </ol>
                <p>
                    Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.
                </p>
            </>
        </Suspense>
    );
}

async function getStarWarsMovies(): Promise<MovieDetails[]> {
    // Simulate slow network
    await new Promise((r) => setTimeout(r, 2000));
    console.log("query is executed on " + (isServer ? "server" : "client"));
    const response = await fetch("https://star-wars.brillout.com/api/films.json");
    let movies: MovieDetails[] = ((await response.json()) as any).results;
    movies = movies.map((movie: MovieDetails, i: number) => ({
        ...movie,
        id: String(i + 1),
    }));
    return movies;
}
