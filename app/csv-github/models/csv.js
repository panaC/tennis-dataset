
module.exports = (sequelize, DataType) => {

  var csv = sequelize.define('csv', {
    hashId: {
      type: DataType.STRING
    },
    tourney_id:{
      type: DataType.STRING
    },
    tourney_name:{
      type: DataType.STRING
    } ,
    surface:{
      type: DataType.STRING
    } ,
    draw_size:{
      type: DataType.STRING
    } ,
    tourney_level:{
      type: DataType.STRING
    } ,
    tourney_date:{
      type: DataType.STRING
    } ,
    match_num:{
      type: DataType.INTEGER
    } ,
    winner_id:{
      type: DataType.STRING
    } ,
    winner_seed:{
      type: DataType.STRING
    } ,
    winner_entry:{
      type: DataType.STRING
    } ,
    winner_name:{
      type: DataType.STRING
    } ,
    winner_hand:{
      type: DataType.STRING
    } ,
    winner_ht:{
      type: DataType.STRING
    } ,
    winner_ioc:{
      type: DataType.STRING
    } ,
    winner_age:{
      type: DataType.FLOAT
    } ,
    winner_rank:{
      type: DataType.INTEGER
    } ,
    winner_rank_points:{
      type: DataType.INTEGER
    } ,
    loser_id:{
      type: DataType.STRING
    } ,
    loser_seed: {
      type: DataType.STRING
    } ,
    loser_entry:{
      type: DataType.STRING
    } ,
    loser_name:{
      type: DataType.STRING
    } ,
    loser_hand:{
      type: DataType.STRING
    } ,
    loser_ht:{
      type: DataType.STRING
    } ,
    loser_ioc:{
      type: DataType.STRING
    } ,
    loser_age:{
      type: DataType.FLOAT
    } ,
    loser_rank:{
      type: DataType.INTEGER
    } ,
    loser_rank_points:{
      type: DataType.INTEGER
    } ,
    score:{
      type: DataType.STRING
    } ,
    best_of:{
      type: DataType.STRING
    } ,
    round:{
      type: DataType.STRING
    } ,
    minutes: {
      type: DataType.INTEGER
    } ,
    w_ace:{
      type: DataType.INTEGER
    } ,
    w_df:{
      type: DataType.INTEGER
    } ,
    w_svpt:{
      type: DataType.INTEGER
    } ,
    w_1stIn: {
      type: DataType.INTEGER
    } ,
    w_1stWon:{
      type: DataType.INTEGER
    } ,
    w_2ndWon:{
      type: DataType.INTEGER
    } ,
    w_SvGms: {
      type: DataType.INTEGER
    } ,
    w_bpSaved:{
      type: DataType.INTEGER
    } ,
    w_bpFaced:{
      type: DataType.INTEGER
    } ,
    l_ace:{
      type: DataType.INTEGER
    } ,
    l_df:{
      type: DataType.INTEGER
    } ,
    l_svpt:{
      type: DataType.INTEGER
    } ,
    l_1stIn:{
      type: DataType.INTEGER
    } ,
    l_1stWon:{
      type: DataType.INTEGER
    } ,
    l_2ndWon:{
      type: DataType.INTEGER
    } ,
    l_SvGms:{
      type: DataType.INTEGER
    } ,
    l_bpSaved:{
      type: DataType.INTEGER
    } ,
    l_bpFaced:{
      type: DataType.INTEGER
    }
  });

  return csv;
}
