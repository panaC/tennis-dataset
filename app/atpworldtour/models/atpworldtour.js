
module.exports = (sequelize, DataType) => {

  var atpworldtour = sequelize.define('atpworldtour', {
    hashId: {
      type: DataType.STRING
    },
    name: {
      type: DataType.STRING
    },
    location: {
      type: DataType.STRING
    },
    date: {
      type: DataType.DATE
    },
    door: {
      type: DataType.STRING
    },
    surface: {
      type: DataType.STRING
    },
    prize: {
      type: DataType.INTEGER
    },
    url: {
      type: DataType.STRING
    },
    year: {
      type: DataType.STRING
    },
    winner: {
      type: DataType.STRING
    },
    winner_url: {
      type: DataType.STRING
    },
    loser: {
      type: DataType.STRING
    },
    loser_url: {
      type: DataType.STRING
    },
    stats_url: {
      type: DataType.STRING
    },
    winner_serve_rating: {
      type: DataType.INTEGER
    },
    loser_serve_rating: {
      type: DataType.INTEGER
    },
    winner_aces: {
      type: DataType.INTEGER
    },
    loser_aces: {
      type: DataType.INTEGER
    },
    winner_double_faults: {
      type: DataType.INTEGER
    },
    loser_double_faults: {
      type: DataType.INTEGER
    },
    winner_first_serve_ptg: {
      type: DataType.INTEGER
    },
    winner_first_serve_over: {
      type: DataType.INTEGER
    },
    winner_first_serve_under: {
      type: DataType.INTEGER
    },
    loser_first_serve_ptg: {
      type: DataType.INTEGER
    },
    loser_first_serve_over: {
      type: DataType.INTEGER
    },
    loser_first_serve_under: {
      type: DataType.INTEGER
    },
    winner_first_serve_point_won_ptg: {
      type: DataType.INTEGER
    },
    winner_first_serve_point_won_over: {
      type: DataType.INTEGER
    },
    winner_first_serve_point_won_under: {
      type: DataType.INTEGER
    },
    loser_first_serve_point_won_ptg: {
      type: DataType.INTEGER
    },
    loser_first_serve_point_won_over: {
      type: DataType.INTEGER
    },
    loser_first_serve_point_won_under: {
      type: DataType.INTEGER
    },
    winner_second_serve_point_won_ptg: {
      type: DataType.INTEGER
    },
    winner_second_serve_point_won_over: {
      type: DataType.INTEGER
    },
    winner_second_serve_point_won_under: {
      type: DataType.INTEGER
    },
    loser_second_serve_point_won_ptg: {
      type: DataType.INTEGER
    },
    loser_second_serve_point_won_over: {
      type: DataType.INTEGER
    },
    loser_second_serve_point_won_under: {
      type: DataType.INTEGER
    },
    winner_bp_saved_ptg: {
      type: DataType.INTEGER
    },
    winner_bp_saved_over: {
      type: DataType.INTEGER
    },
    winner_bp_saved_under: {
      type: DataType.INTEGER
    },
    loser_bp_saved_ptg: {
      type: DataType.INTEGER
    },
    loser_bp_saved_over: {
      type: DataType.INTEGER
    },
    loser_bp_saved_under: {
      type: DataType.INTEGER
    },
    winner_service_game_played: {
      type: DataType.INTEGER
    },
    loser_service_game_played: {
      type: DataType.INTEGER
    },
    winner_return_rating: {
      type: DataType.INTEGER
    },
    loser_return_rating: {
      type: DataType.INTEGER
    },
    winner_first_serve_return_point_won_ptg: {
      type: DataType.INTEGER
    },
    winner_first_serve_return_point_won_over: {
      type: DataType.INTEGER
    },
    winner_first_serve_return_point_won_under: {
      type: DataType.INTEGER
    },
    loser_first_serve_return_point_won_ptg: {
      type: DataType.INTEGER
    },
    loser_first_serve_return_point_won_over: {
      type: DataType.INTEGER
    },
    loser_first_serve_return_point_won_under: {
      type: DataType.INTEGER
    },
    winner_second_serve_return_point_won_ptg: {
      type: DataType.INTEGER
    },
    winner_second_serve_return_point_won_over: {
      type: DataType.INTEGER
    },
    winner_second_serve_return_point_won_under: {
      type: DataType.INTEGER
    },
    loser_second_serve_return_point_won_ptg: {
      type: DataType.INTEGER
    },
    loser_second_serve_return_point_won_over: {
      type: DataType.INTEGER
    },
    loser_second_serve_return_point_won_under: {
      type: DataType.INTEGER
    },
    winner_bp_converted_ptg: {
      type: DataType.INTEGER
    },
    winner_bp_converted_over: {
      type: DataType.INTEGER
    },
    winner_bp_converted_under: {
      type: DataType.INTEGER
    },
    loser_bp_converted_ptg: {
      type: DataType.INTEGER
    },
    loser_bp_converted_over: {
      type: DataType.INTEGER
    },
    loser_bp_converted_under: {
      type: DataType.INTEGER
    },
    winner_return_games_played: {
      type: DataType.INTEGER
    },
    loser_return_games_played: {
      type: DataType.INTEGER
    },
    winner_service_point_won_ptg: {
      type: DataType.INTEGER
    },
    winner_service_point_won_over: {
      type: DataType.INTEGER
    },
    winner_service_point_won_under: {
      type: DataType.INTEGER
    },
    loser_service_point_won_ptg: {
      type: DataType.INTEGER
    },
    loser_service_point_won_over: {
      type: DataType.INTEGER
    },
    loser_service_point_won_under: {
      type: DataType.INTEGER
    },
    winner_return_point_won_ptg: {
      type: DataType.INTEGER
    },
    winner_return_point_won_over: {
      type: DataType.INTEGER
    },
    winner_return_point_won_under: {
      type: DataType.INTEGER
    },
    loser_return_point_won_ptg: {
      type: DataType.INTEGER
    },
    loser_return_point_won_over: {
      type: DataType.INTEGER
    },
    loser_return_point_won_under: {
      type: DataType.INTEGER
    },
    winner_total_point_won_ptg: {
      type: DataType.INTEGER
    },
    winner_total_point_won_over: {
      type: DataType.INTEGER
    },
    winner_total_point_won_under: {
      type: DataType.INTEGER
    },
    loser_total_point_won_ptg: {
      type: DataType.INTEGER
    },
    loser_total_point_won_over: {
      type: DataType.INTEGER
    },
    loser_total_point_won_under: {
      type: DataType.INTEGER
    }
  });

  return atpworldtour;
}
