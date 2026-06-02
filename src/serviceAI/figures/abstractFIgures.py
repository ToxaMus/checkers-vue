from abc import ABC, abstractmethod
from board import Board
from typing import List, Dict, Tuple, Optional

class AbstractFigure(ABC):
    @abstractmethod
    def move(self, selected_fig: Dict[str, int], color_fig: str, board: Board) -> Optional[List[Tuple[Tuple[int, int], Tuple[int, int], bool]]]:
        pass

    # Все диагональные направления
    DIRECTIONS: List[Tuple[int, int]] = [
        (-1, -1),  # вверх-влево
        (-1, 1),   # вверх-вправо
        (1, -1),   # вниз-влево
        (1, 1)     # вниз-вправо
    ]

    def array_sorting(self, selected_figure: Dict[str, int], moves: List[Dict[str, int]], is_eat: bool = False) -> List[Tuple[Tuple[int, int], Tuple[int, int], bool]]:
        """Форматирует список ходов в нужный формат"""
        result = []
        from_pos = (selected_figure['x'], selected_figure['y'])
        
        for move in moves:
            to_pos = (move['x'], move['y'])
            result.append((from_pos, to_pos, is_eat))
        
        return result
    
    def is_forward_direction(self, dx: int, color: str) -> bool:
        """
        Проверяет, является ли направление движения вперёд для обычного хода.
        По умолчанию — для шашек. Дамки могут переопределить.
        """
        if color == 'WHITE':
            return dx == -1
        else:  # BLACK
            return dx == 1