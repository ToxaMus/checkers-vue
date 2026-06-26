from typing import List, Dict

class Board:
    """Игровая доска размером WIDTH x HEIGHT (8x8)."""
    WIDTH = 8
    HEIGHT = 8

    def __init__(self, array: List[List[int]]):
        self.__board = array

    def get_figure(self, x: int, y: int) -> int:
        """Возвращает код фигуры в клетке (x, y). Вне доски считается 0 (пусто)."""
        if 0 <= x < self.WIDTH and 0 <= y < self.HEIGHT:
            return self.__board[x][y]
        return 0

    def set_figure(self, x: int, y: int, figure: int) -> None:
        """Устанавливает фигуру в клетку (x, y)."""
        if 0 <= x < self.WIDTH and 0 <= y < self.HEIGHT:
            self.__board[x][y] = figure

    def get_all_figures_of_color(self, color: str) -> List[Dict[str, int]]:
        """Возвращает список всех фигур заданного цвета."""
        result = []
        for row in range(self.WIDTH):
            for col in range(self.HEIGHT):
                fig = self.__board[row][col]
                if self.is_color(fig, color):
                    result.append({'figure': fig, 'x': row, 'y': col})
        return result

    @staticmethod
    def is_color(figure: int, color: str) -> bool:
        """Проверяет принадлежность фигуры цвету."""
        if color == 'WHITE':
            return figure > 0
        if color == 'BLACK':
            return figure < 0
        return False

    def copy(self) -> 'Board':
        """Создаёт глубокую копию доски."""
        new_board = [row[:] for row in self.__board]
        return Board(new_board)
