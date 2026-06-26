from typing import Dict, List, Tuple, Optional, Any
from abstractFigure import AbstractFigure
from board import Board

class Checker(AbstractFigure):
    """Обычная шашка."""

    def move(self, selected_fig: Dict[str, int], color_fig: str, board: Board) -> List[Tuple[Tuple[int, int], Tuple[int, int], bool]]:
        possible = self._find_possible_cells(selected_fig, color_fig, board)

        enemies = [p for p in possible if p['figure'] != 0]
        empty_cells = [p for p in possible if p['figure'] == 0]

        # Если есть потенциальные враги, проверяем, можно ли их съесть
        if enemies:
            eat_targets = []
            for enemy in enemies:
                target = self._find_eat_target(enemy, selected_fig, board)
                if target is not None:
                    eat_targets.append({'x': target[0], 'y': target[1]})
            if eat_targets:
                # Обязательное взятие
                return self.format_moves(selected_fig, eat_targets, is_eat=True)

        if empty_cells:
            return self.format_moves(selected_fig, empty_cells, is_eat=False)

        return []

    def _find_possible_cells(self, fig: Dict[str, int], color: str, board: Board) -> List[Dict[str, Any]]:
        result = []
        x0, y0 = fig['x'], fig['y']

        for dx, dy in self.DIRECTIONS:
            nx, ny = x0 + dx, y0 + dy
            if not (0 <= nx < Board.WIDTH and 0 <= ny < Board.HEIGHT):
                continue

            figure = board.get_figure(nx, ny)

            if figure == 0:
                # Пустая клетка — только если направление вперёд
                if self._is_forward(dx, color):
                    result.append({'figure': 0, 'x': nx, 'y': ny})
            else:
                # Фигура на клетке: проверяем, враг ли это
                is_enemy = not AbstractFigure.is_allied(figure, fig['figure'])
                if is_enemy:
                    # Для взятия добавляем клетку с врагом, даже если она «назад»
                    result.append({'figure': figure, 'x': nx, 'y': ny})

        return result

    def _find_eat_target(self, enemy: Dict[str, Any], selected: Dict[str, int], board: Board) -> Optional[Tuple[int, int]]:
        dx = 1 if enemy['x'] > selected['x'] else -1
        dy = 1 if enemy['y'] > selected['y'] else -1

        nx, ny = enemy['x'] + dx, enemy['y'] + dy

        if 0 <= nx < Board.WIDTH and 0 <= ny < Board.HEIGHT and board.get_figure(nx, ny) == 0:
            return (nx, ny)
        return None

    @staticmethod
    def _is_forward(dx: int, color: str) -> bool:
        """
        Определяет, является ли направление движением вперёд.
        Предполагается, что x — это вертикаль (ряд).
        Белые идут вверх (dx == -1), чёрные — вниз (dx == 1).
        """
        return (color == 'WHITE' and dx == -1) or (color == 'BLACK' and dx == 1)
