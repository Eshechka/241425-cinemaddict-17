import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
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

  #adaptFilmToServer = (film) => {
    const adaptedFilm = {
      ...film,
      ['film_info']: {
        ...film.film_info,
        'alternative_title': film.film_info.alternativeTitle,
        'total_rating': film.film_info.rating,
        'poster': film.film_info.imgSrc,
        'age_rating': film.film_info.ageRating,
        'runtime': film.film_info.duration,
      },
      // comments: film.comments.map((cmt) => cmt.id),
      'user_details': film.userDetails,
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.rating;
    delete adaptedFilm.film_info.imgSrc;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.duration;
    delete adaptedFilm.userDetails;

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

    return adaptedComment;
  };

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
}
