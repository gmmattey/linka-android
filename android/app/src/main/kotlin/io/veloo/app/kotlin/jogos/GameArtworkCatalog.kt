package io.signallq.app.jogos

import androidx.annotation.DrawableRes

data class GameArtwork(
    @param:DrawableRes val drawableRes: Int,
)

object GameArtworkCatalog {
    /**
     * Desativado temporariamente (issue #1097): os drawables `game_art_*` abaixo nao sao
     * confirmados como arte oficial/licenciada e cortavam texto nas bordas com
     * ContentScale.Crop em GameArtworkBadge (screenshot real, modo claro). Retorna sempre
     * null ate a Lia entregar arte adequada -- GameArtworkBadge ja cai no fallback de
     * cor+sigla automaticamente quando forGame() retorna null.
     *
     * Nao remover os drawables `game_art_*` em `android/app/src/main/res/` (varias pastas
     * drawable): reativar restaurando o mapeamento abaixo (preservado em comentario, e no
     * historico do git) assim que houver arte validada.
     *
     * Mapeamento original, gameId -> drawable:
     * fortnite -> game_art_fortnite
     * warzone -> game_art_warzone
     * apex_legends -> game_art_apex_legends
     * rocket_league -> game_art_rocket_league
     * overwatch -> game_art_overwatch
     * rainbow_six_siege -> game_art_rainbow_six_siege
     * ea_sports_fc -> game_art_ea_sports_fc
     * marvel_rivals -> game_art_marvel_rivals
     * pubg_battlegrounds -> game_art_pubg_battlegrounds
     * dead_by_daylight -> game_art_dead_by_daylight
     * the_finals -> game_art_the_finals
     * destiny_2 -> game_art_destiny_2
     * valorant -> game_art_valorant
     * league_of_legends -> game_art_league_of_legends
     * counter_strike_2 -> game_art_counter_strike_2
     * dota_2 -> game_art_dota_2
     */
    @Suppress("UNUSED_PARAMETER")
    fun forGame(gameId: String): GameArtwork? = null
}
