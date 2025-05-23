import React from 'react';
import {
    __experimentalText as Text,
    __experimentalHeading as Heading,
} from '@wordpress/components';
import { getApiConfig } from '../utils/api';

/**
 * Handle movie genre component
 * @param {Object} props - Component props
 * @param {Array} props.genreIDArr - genre id array
 * @param {Object} props.attributes - block attributes
 * @returns {JSX.Element} Rendered HTML
 */
const HandleGenreRender = ({ genreIDArr, attributes }) => {
    const getGenre = attributes.genres;
    const newGenreArr = getGenre.filter((genre) => genreIDArr.includes(genre.id));
    
    return (
        <ul className="movie-card__genres">
            {newGenreArr.map((genre) => (
                <li key={genre.id} className="movie-card__genre-item">
                    {genre.name}
                </li>
            ))}
        </ul>
    );
};

/**
 * MovieCard component
 * @param {Object} props - Component props
 * @param {Object} props.movie - movie object
 * @param {Object} props.attributes - block attributes
 * @returns {JSX.Element} Rendered HTML
 */
const MovieCard = ({ movie, attributes }) => {
    const { imageBaseUrl } = getApiConfig();
    const headingPadding = attributes.titlePaddingAttr;
    
    return (
        <div className="movie-card">
            <div className="movie-card__image">
                <img
                    src={`${imageBaseUrl}${movie.poster_path}`}
                    alt={movie.title}
                />
                <div className="meta">
                    <div className="language-date">
                        {attributes.showLanguage && (
                            <span className="language">
                                {movie.original_language}
                            </span>
                        )}
                        {attributes.showReleaseDate && (
                            <span className="date">{movie.release_date}</span>
                        )}
                    </div>
                    <div className="vote">
                        {attributes.showVoteAverage && (
                            <span className="vote-average">
                                {movie.vote_average}
                            </span>
                        )}
                        {attributes.showVoteCount && (
                            <span className="vote-count">
                                {movie.vote_count}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="movie-card__content">
                <Heading
                    style={{
                        fontSize: `${attributes.titleFontSize}px`,
                        fontWeight: attributes.titleFontWeight,
                        letterSpacing: `${attributes.titleLetterSpacing}px`,
                        lineHeight: `${attributes.titleLineHeight}`,
                        fontStyle: attributes.titleStyle,
                        textTransform: attributes.titleTransform,
                        textDecoration: attributes.titleDecoration,
                        padding: `${headingPadding?.top} ${headingPadding?.right} ${headingPadding?.bottom} ${headingPadding?.left}`,
                    }}
                    level={2}
                >
                    {movie.title}
                </Heading>
                <div
                    className="movie-card__overview overview"
                    style={{
                        padding: `${attributes.contentPaddingAttr.top} ${attributes.contentPaddingAttr.right} ${attributes.contentPaddingAttr.bottom} ${attributes.contentPaddingAttr.left}`,
                    }}
                >
                    <Text>{movie.overview}</Text>
                </div>
                <div
                    className="movie-card__content__footer"
                    style={{
                        padding: `${attributes.contentPaddingAttr.top} ${attributes.contentPaddingAttr.right} ${attributes.contentPaddingAttr.bottom} ${attributes.contentPaddingAttr.left}`,
                    }}
                >
                    {attributes.showGenre && (
                        <div className="genre">
                            <HandleGenreRender
                                genreIDArr={movie.genre_ids}
                                attributes={attributes}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;