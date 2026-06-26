from typing import Dict, List, Tuple, Any
from abstractFigure import AbstractFigure
from board import Board

class King(AbstractFigure):
    """Дамка (король в шашках)."""

    def move(self, selected_fig: Dict[str, int], board: Board) -> List[Tuple[Tuple[int, int], Tuple[int, int], bool]]:
        all_cells = self._find_reachable_cells(selected_fig, board)

        # Отделяем врагов от пустых клеток
        enemies = []
        empty_cells = []

        for c in all_cells:
            if c['figure'] != 0:
                # Проверяем, что это действительно враг
                if not AbstractFigure.is_allied(c['figure'], selected_fig['figure']):
                    enemies.append(c)
            else:
                empty_cells.append(c)

        # Если есть враги, пытаемся найти возможные взятия
        if enemies:
            eat_moves = self._find_eat_targets(selected_fig, enemies, board)
            if eat_moves:
                return self.format_moves(selected_fig, eat_moves, is_eat=True)

        # Иначе — обычные ходы
        if empty_cells:
            return self.format_moves(selected_fig, empty_cells, is_eat=False)

        return []

    def _find_reachable_cells(self, fig: Dict[str, int], board: Board) -> List[Dict[str, Any]]:
        result = []
        x0, y0 = fig['x'], fig['y']

        for dx, dy in self.DIRECTIONS:
            x, y = x0 + dx, y0 + dy
            while 0 <= x < Board.WIDTH and 0 <= y < Board.HEIGHT:
                figure = board.get_figure(x, y)
                if figure == 0:
                    result.append({'figure': 0, 'x': x, 'y': y})
                else:
                    if AbstractFigure.is_allied(figure, fig['figure']):
                        # Союзник — дальше по диагонали не идём
                        break
                    else:
                        # Враг — добавляем и останавливаемся (для поиска взятий)
                        result.append({'figure': figure, 'x': x, 'y': y})
                        break
                x += dx
                y += dy
        return result

    def _find_eat_targets(self, fig: Dict[str, int], enemies: List[Dict[str, int]], board: Board,) -> List[Dict[str, int]]:
        targets = []
        for enemy in enemies:
            dx = 1 if enemy['x'] > fig['x'] else -1
            dy = 1 if enemy['y'] > fig['y'] else -1

            x, y = enemy['x'] + dx, enemy['y'] + dy
            while 0 <= x < Board.WIDTH and 0 <= y < Board.HEIGHT:
                if board.get_figure(x, y) == 0:
                    targets.append({'x': x, 'y': y})
                else:
                    # Встретили любую фигуру — дальше нельзя
                    break
                x += dx
                y += dy
        return targets
