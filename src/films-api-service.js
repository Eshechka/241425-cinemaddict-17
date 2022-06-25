import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  getComments(filmId) {
    return this._load({ url: `/comments/${filmId}` })
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptFilmToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.filmId}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptCommentToServer(comment)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };

  #adaptFilmToServer = (film) => {
    const adaptedFilm = {
      ...film,
      ['film_info']: {
        ...film.filmInfo,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.rating,
        'poster': film.filmInfo.imgSrc,
        'age_rating': film.filmInfo.ageRating,
        'runtime': film.filmInfo.duration,
        'genre': film.filmInfo.genres,
      },
      'user_details': {
        ...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
      },
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.rating;
    delete adaptedFilm.film_info.imgSrc;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.duration;
    delete adaptedFilm.film_info.genres;
    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.user_details.alreadyWatched;

    return adaptedFilm;
  };

  #adaptCommentToServer = (comment) => {
    const adaptedComment = {
      ...comment,
      'comment': comment.text,
      'emotion': comment.emojiName,
    };

    // Ненужные ключи мы удаляем
    delete adaptedComment.text;
    delete adaptedComment.emojiName;
    delete adaptedComment.filmId;

    return adaptedComment;
  };
}

