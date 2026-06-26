from abc import ABC, abstractmethod
from typing import List, Tuple, Dict
from board import Board

class AbstractFigure(ABC):
    """Абстрактный класс фигуры. Все фигуры должны реализовать метод move()."""

    # Все четыре диагональных направления (dx, dy)
    DIRECTIONS = [(-1, -1), (-1, 1), (1, -1), (1, 1)]

    @abstractmethod
    def move(self, selected_fig: Dict[str, int], color_fig: str, board: Board) -> List[Tuple[Tuple[int, int], Tuple[int, int], bool]]:
        """
        Генерирует список возможных ходов для фигуры.
        :param selected_fig: словарь {'figure': код, 'x': ряд, 'y': колонка}
        :param color_fig: цвет фигуры ('WHITE' или 'BLACK')
        :param board: объект доски
        :return: список кортежей ((from_x, from_y), (to_x, to_y), is_eat)
        """
        pass

    @staticmethod
    def format_moves(selected_figure: Dict[str, int], moves: List[Dict[str, int]], is_eat: bool = False) -> List[Tuple[Tuple[int, int], Tuple[int, int], bool]]:
        """Преобразует список словарей с координатами в формат кортежей."""
        if not moves:
            return []

        from_pos = (selected_figure['x'], selected_figure['y'])
        result = []
        for m in moves:
            to_pos = (m['x'], m['y'])
            result.append((from_pos, to_pos, is_eat))
        return result

    @staticmethod
    def is_allied(fig1: int, fig2: int) -> bool:
        """Проверяет, являются ли две фигуры союзниками (одного цвета)."""
        if fig1 == 0 or fig2 == 0:
            return False
        return (fig1 > 0 and fig2 > 0) or (fig1 < 0 and fig2 < 0)
